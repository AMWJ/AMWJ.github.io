function openDictionary()
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "randomlist.txt")
	xhr.onreadystatechange = function ()
	{
		if (this.readyState === 4)
		{
			alert(this.response);
		}
	};
	xhr.send();
}


function findFriends(base, dictionary)
{
	var ret=[]
	for (var i = 0; i < dictionary.length; i++)
	{
		if(isFriend(base,dictionary[i]))	//For each element of the dictionary, if it is a friend, add it to the dictionary.
		{
			ret.append(dictionary[i]);
		}
	}
}
function isFriend(base, acquaintance) //A word is not its own friend (As per definition).
{
	if (base == acquaintance)
	{
		return false;
	}
	var aLength = acquaintance.length
	var bLength = base.length
	var minLength = Math.min(aLength, bLength);
	var maxLength = Math.max(aLength, bLength);
	if (Math.abs(aLength - bLength) > 1)
	{
		return false;
	}
	var j = 0;
	while (j < minLength)	//Start from the back, and check equality of each letter.
	{
		if (acquaintance[aLength-j-1] != base[bLength-j-1])
		{
			break;	//If the letters are different, end the loop now.
		}
		j++;	//Count the letters at the end of the string that are the same.
	}
	var i = 0;
	while (i < minLength)	//Start from the front, and check equality of each letter.
	{
		if (acquaintance[i] != base[i])
		{
			break;
		}
		i++;	//Count the letters at the front of the string that are the same.
	}
	return maxLength <= (i + j + 1)	/*If we can account for all but a single letter, the words are friends. 
									  Inequality is necessary for repeated letters that were matched from both sides. For example: 
									  arrgh
									  arrrgh
									  Word lengths more than 1 letter and word equality were filtered out earlier. So the only time when letters were double counted is with repeated letters.*/
}